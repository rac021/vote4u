
package com.rac021.jaxy.impl.service.time ;

/**
 *
 * @author ryahiaoui
 */

import javax.ws.rs.GET ;
import java.time.Instant ;
import javax.ws.rs.Produces ;
import javax.inject.Singleton ;
import javax.ws.rs.core.Response ;
import io.quarkus.runtime.Startup ;
import javax.annotation.PostConstruct ;
import com.rac021.jaxy.api.qualifiers.ServiceRegistry ;

/**
 *
 * @author R.Yahiaoui
 */


@ServiceRegistry("time")
@Singleton
@Startup
public class ServiceTime  {

    @PostConstruct
    public void init()    {  }

    public ServiceTime()  {
        System.out.println( " Time Service : " + this ) ;
    }

    @GET
    @Produces({ "xml/plain", "json/plain" })
    public Response getTime() throws InterruptedException {
        
       return Response.status(Response.Status.OK)
                      .entity(String.valueOf(Instant.now().toEpochMilli()))
                      .build() ;
    }
    
     
}
