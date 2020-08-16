
package com.rac021.jaxy.impl.service.vote ;

/**
 *
 * @author ryahiaoui
 */

import javax.ws.rs.GET ;
import javax.ws.rs.Produces ;
import javax.inject.Singleton ;
import javax.ws.rs.HeaderParam ;
import javax.ws.rs.core.UriInfo ;
import javax.ws.rs.core.Context ;
import javax.ws.rs.core.Response ;
import io.quarkus.arc.Unremovable ;
import javax.annotation.PostConstruct ;
import com.rac021.jaxy.api.security.Policy ;
import com.rac021.jaxy.api.security.Secured ;
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
   
    @PostConstruct
    public void init() {
    }

    public Service()   {
    }
    
    @GET
    @Produces( {  "xml/plain" , "json/plain" , "json/encrypted" , "xml/encrypted"   } )
    public Response cancel ( @HeaderParam("API-key-Token") String token  , 
                             @HeaderParam("keep") String filterdIndex    , 
                             @Context UriInfo uriInfo ) throws Exception {    
         
        return Response.status(Response.Status.OK)
                       .entity("\n Voter \n" )
                       .build() ;      
    }
  
}
