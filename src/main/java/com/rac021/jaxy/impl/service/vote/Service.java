
package com.rac021.jaxy.impl.service.vote ;

/**
 *
 * @author ryahiaoui
 */

import java.util.Set ;
import javax.ws.rs.GET ;
import javax.ws.rs.Path ;
import java.util.HashSet ;
import javax.ws.rs.Produces ;
import javax.inject.Singleton ;
import java.util.stream.Stream ;
import javax.ws.rs.HeaderParam ;
import javax.ws.rs.core.UriInfo ;
import javax.ws.rs.core.Context ;
import javax.ws.rs.core.Response ;
import io.quarkus.arc.Unremovable ;
import javax.annotation.PostConstruct ;
import java.util.concurrent.ConcurrentMap ;
import com.rac021.jaxy.api.security.Policy ;
import com.rac021.jaxy.api.security.Secured ;
import java.util.concurrent.ConcurrentHashMap ;
import com.rac021.jaxy.api.qualifiers.ServiceRegistry ;

/**
 *
 * @author R.Yahiaoui
 */

@ServiceRegistry("vote")
@Secured(policy = Policy.CustomSignOn )
@Singleton
@Unremovable
public class Service   {
   
    public static final ConcurrentMap<String, Integer> voteStats = new ConcurrentHashMap<>() ;
    public static final Set<String> voters                       = new HashSet<>()           ;
    
    public Service()   {}
    
    @PostConstruct
    public void init() {}
    
    @GET
    @Path("/")
    @Produces( {  "xml/plain" , "json/plain" , "json/encrypted" , "xml/encrypted"  } )
    public Response vote ( @HeaderParam("API-key-Token") String token     , 
                           @HeaderParam("animators")     String animators , 
                           @HeaderParam("userName")      String userName  , 
                           @Context UriInfo uriInfo ) throws Exception    {
        
        if( animators == null || animators.trim().isEmpty() )   {
            
            return Response.status( Response.Status.BAD_REQUEST )
                           .entity( "\n Empty Vote not Authorized \n" )
                           .build() ;      
        }
        
        if( voters.contains( userName.trim() ))      {
            
            return Response.status( Response.Status.FORBIDDEN )
                           .entity( "\n Already Voted \n" )
                           .build() ;      
        }
        
        String[] animatorsNames = animators.split( "," ) ;
        
        Stream.of( animatorsNames ).forEach( animator -> {
            voteStats.compute( animator.trim().toLowerCase()       , 
                               ( k, v ) -> v == null ? 1 : v + 1 ) ;

        } ) ;
        
        voters.add( userName.trim().toLowerCase()  )               ;
        
        return Response.status( Response.Status.OK )
                       .entity("\n Voted ! Thank You :-) \n" )
                       .build() ;      
    }
  
    @GET
    @Path("/alreadyVoted")
    @Produces( {  "xml/plain" , "json/plain" , "json/encrypted" , "xml/encrypted"  } )
    public Response alreadyVoted ( @HeaderParam("API-key-Token") String token     , 
                                   @HeaderParam("animators" )    String animators , 
                                   @HeaderParam("userName"  )    String userName  , 
                                   @Context UriInfo uriInfo ) throws Exception    {
      
        if( voters.contains( userName.trim() ))           {
            
            return Response.status( Response.Status.OK    )
                           .entity( "\n Already Voted \n" )
                           .build() ;      
        }
       
        return Response.status( Response.Status.NOT_FOUND )
                       .entity("\n No Vote Yet ! \n" )
                       .build() ;      
    }
}
