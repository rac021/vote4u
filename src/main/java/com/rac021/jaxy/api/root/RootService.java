
package com.rac021.jaxy.api.root ;

import java.util.Map ;
import javax.ws.rs.GET ;
import javax.ws.rs.Path ;
import java.util.HashMap ;
import java.util.Objects ;
import java.time.Instant ;
import javax.inject.Inject ;
import javax.ws.rs.PathParam ;
import java.util.logging.Level ;
import javax.ws.rs.HeaderParam ;
import java.time.LocalDateTime ;
import java.util.logging.Logger ;
import javax.ws.rs.core.Context ;
import javax.ws.rs.core.UriInfo ;
import javax.ws.rs.core.Response ;
import javax.ws.rs.core.MediaType ;
import javax.enterprise.inject.Any ;
import javax.annotation.PostConstruct ;
import io.quarkus.runtime.Application ;
import javax.enterprise.inject.Instance ;
import javax.enterprise.inject.spi.Bean ;
import java.time.format.DateTimeFormatter ;
import com.rac021.jaxy.api.security.Policy ;
import com.rac021.jaxy.api.security.Custom ;
import com.rac021.jaxy.api.security.ISignOn ;
import javax.servlet.http.HttpServletRequest ;
import javax.enterprise.inject.spi.BeanManager ;
import javax.enterprise.util.AnnotationLiteral ;
import org.jboss.resteasy.core.ResteasyContext ;
import javax.enterprise.context.ApplicationScoped ;
import com.rac021.jaxy.api.qualifiers.ServiceRegistry ;
import com.rac021.jaxy.api.exceptions.BusinessException ;
import static com.rac021.jaxy.api.logger.LoggerFactory.getLogger ;
import com.rac021.jaxy.api.exceptions.UnAuthorizedResourceException ;

/**
 * REST Web Service
 *
 * @author yahiaoui
 */

@Path(RootService.PATH_RESOURCE)
@ApplicationScoped

public class RootService implements IRootService     {

    private static final Logger LOGGER = getLogger() ;
   
    public static final String LOGIN         = "{login}"          ;

    public static final String SIGNATURE     = "{signature}"      ;

    public static final String TIMESTAMP     = "{timeStamp}"      ;

    public static final String SERVICENAME   = "{_service_Name_}" ;

    public static final String SERVICENAME_P = "_service_Name_"   ;

    public static final String PATH_RESOURCE = "/resources"       ;

    public static final String SEPARATOR     = "/"                ;
    
    @Inject @Any
    Instance<ISignOn> signOn ;

    @Inject
    BeanManager bm           ;

    public static Map<String, Object> services = new HashMap<>()  ;
            
    public RootService()     {
    }

    @PostConstruct
    public void init()  {
        
        System.out.println( " ++ Init Root Service" ) ;
       
        register ( "time" ,  com.rac021.jaxy.coby.impl.service.time.ServiceTime.class  ) ;
        register ( "vote"  , com.rac021.jaxy.impl.service.vote.Service.class ) ;
    }

    @Override
    @Path( SERVICENAME   )
    public Object subResourceLocators( @HeaderParam("API-key-Token")   String             token     ,
                                       @HeaderParam("Accept")          String             accept    ,
                                       @HeaderParam("Cipher")          String             cipher    ,
                                       @HeaderParam("Keep")            String             keep      ,
                                       @Context                        HttpServletRequest request   ,
                                       @PathParam(SERVICENAME_P) final String             codeService ) throws BusinessException {

        System.out.println( "==================================                                         " ) ;  
        System.out.println( "token = " + token                                                            ) ;
        System.out.println( "application (inline): " + ResteasyContext.getContextData(Application.class ) ) ;
        System.out.println( "==================================                                         " ) ;  

        RuntimeServiceInfos.STARTED_TIME.set(Instant.now()) ;
          
        RuntimeServiceInfos.SERVICE_NAME.set( codeService ) ;
        RuntimeServiceInfos.ACCEPT.set( accept )            ;
          
        LOGGER.log( Level.INFO   , 
                    " +++ Invoke resource : ( code_service : {0} ) "     +
                    "( accept : {1} ) ( cipher : {2} ) ( keep : {3} ) "  +
                    "( token : {4} ) ( Date : {5} ) ( RemoteAddr : {6} ) " ,
                    new Object[] { codeService , 
                                   accept      ,
                                   cipher      , 
                                   keep        ,
                                   token       , 
                                   LocalDateTime.now()
                                                .format( DateTimeFormatter
                                                .ofPattern("dd/MM/yyyy HH:mm:ss")) ,
                                   getRemoteAddr(request) } ) ;
                
        return checkAuthAndProcessService ( codeService, accept, token, cipher) ;
    }
  
    private Object checkAuthAndProcessService ( final String codeService , 
                                                final String accept      ,
                                                final String token       , 
                                                final String cipher      ) throws BusinessException {
      
        Policy policy =  Policy.CustomSignOn                                        ;
        
        if( policy == null ) throw new BusinessException("Unavailable Service")     ;
        
            
        if( policy == Policy.Public )                             {
            
            if( accept != null && accept.contains("encrypted") )  {
                throw new BusinessException(" Public Services can't be Encrypted ") ;
            }
           
            return services.get(codeService) ;
        }
        
        if( policy == Policy.SSO ) {
            return services.get(codeService) ;
        }

        /** The following need Authentication . */
          
        if( accept != null && accept.contains("encrypted") && token == null )
            throw new BusinessException(" Header [ API-key-Token ] can't be NULL for secured services ") ;
      
        if( token == null )  throw new BusinessException( " Authentication Required. "
                                                          + "Missing Header [ API-key-Token ] ") ;

        if( policy == Policy.CustomSignOn )   {

            ISignOn implSignOn = signOn.select( new AnnotationLiteral<Custom>() {}) 
                                       .get() ;
            
            if( implSignOn == null ) {
                throw new BusinessException(" No Provider found for Custom Authentication ") ;
            }
            
            if ( implSignOn.checkIntegrity ( token ,
                                             30L /*implSignOn.getConfigurator().getValidRequestTimeout()*/  ) ) {
                
                if( cipher == null ) {
                  //  LOGGER.log(Level.INFO , " -- Default cipher activated : {0}", CipherTypes.AES_128_ECB.name()) ;
                 //   ISignOn.CIPHER.set( CipherTypes.AES_128_ECB.name() ) ;
                }
                else {
                 //   ISignOn.CIPHER.set(cipher.trim())  ; 
                }

                return services.get(codeService) ; // ServiceSensorThings.class ; // servicesManager.get(codeService) ;
            }
        }
        
        LOGGER.log( Level.SEVERE, " --- Unauthorized Resource :" +
                                  " ( code_service : {0} ) ( accept : {1} ) ( cipher : {2} ) ( token : {3} ) " ,
                                 new Object[] { codeService, accept, cipher, token } )       ;
        
        throw new UnAuthorizedResourceException ("Unauthorized Resource - KO_Authentication") ;
    }

    @GET
    @Override
    @Path(LOGIN + SEPARATOR + SIGNATURE + SEPARATOR + TIMESTAMP )
    public Response authenticationCheck( @PathParam("login")     final String login     ,
                                         @PathParam("signature") final String signature ,
                                         @PathParam("timeStamp") final String timeStamp) throws BusinessException {

        if ( signOn.select(new AnnotationLiteral<Custom>() {}).get().checkIntegrity(login, timeStamp, signature)) {
            
             return Response.status ( Response.Status.OK )
                            .entity ( "<status> OK_Authentication </status>" )
                            .type(MediaType.APPLICATION_XML)
                            .build() ;
        }
        throw new UnAuthorizedResourceException ("KO_Authentication") ;
    }
    
    private String getRemoteAddr( HttpServletRequest request ) {

        String ipAddress = request.getHeader("X-FORWARDED-FOR");  
        if (ipAddress == null) {  
           return request.getRemoteAddr();  
        }
        return ipAddress ;
    }
    
    // Will Be Used !
     private String getLocalIPAdress( UriInfo request  ) {
  
        String url = request.getRequestUri().toString()  ; 
        return url.split("://", 2)[1].split(":",2)[0]    ;
    }
     
    public Object getInstance(Class<?> serviceClazz ) {
       
        ServiceRegistry serviceRegistry = serviceClazz.getAnnotation( ServiceRegistry.class       ) ; 
        Bean<Object> bean = (Bean<Object>) bm.resolve(bm.getBeans(serviceClazz, serviceRegistry ) ) ;

        if ( bean != null ) {
            Object cdiService = (Object) bm.getReference( bean                             ,
                                                          bean.getBeanClass()              ,
                                                          bm.createCreationalContext(bean) ) ;
            return cdiService                                                                ;
        }
   
        System.err.println("Bean Null") ;

        return null                     ;
    }

    private void register( String serviceKey , Class aClass ) {
        Object service = getInstance( aClass )                ;
        Objects.requireNonNull( service )                     ;
        services.put( serviceKey , service )                  ;
    }
    
    
     /** Force Init ApplicationScoped at deployement time . */
    /*
      public void init( @Observes 
                        @Initialized(ApplicationScoped.class ) Object init ) {
      }
    */
}

