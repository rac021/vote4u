
package com.rac021.jaxy.impl.service.stats ;

/**
 *
 * @author ryahiaoui
 */

import java.util.Map ;
import javax.ws.rs.GET ;
import java.util.Timer ;
import java.util.TimerTask ;
import javax.ws.rs.sse.Sse ;
import javax.ws.rs.Produces ;
import javax.inject.Singleton ;
import javax.ws.rs.core.Context ;
import javax.ws.rs.core.MediaType ;
import io.quarkus.arc.Unremovable ;
import java.util.stream.Collectors ;
import javax.ws.rs.sse.SseEventSink ;
import javax.ws.rs.sse.SseBroadcaster ;
import com.rac021.jaxy.api.security.Policy ;
import com.rac021.jaxy.api.security.Secured ;
import com.rac021.jaxy.api.qualifiers.ServiceRegistry ;
import static com.rac021.jaxy.impl.service.vote.Service.voteStats ;

/**
 *
 * @author R.Yahiaoui
 */

@ServiceRegistry("stats")
@Secured(policy = Policy.CustomSignOn )
@Singleton
@Unremovable
public class Service {

    @GET
    @Produces( MediaType.SERVER_SENT_EVENTS )
    public void getStats ( @Context Sse sse                  ,
                           @Context SseEventSink eventSink   )  {

         System.out.println( "\nStats Service... "   )       ;
         Thread currentThread = Thread.currentThread()       ; 
         
         SseBroadcaster broadcaster =  sse.newBroadcaster()  ;

         broadcaster.register( eventSink ) ;
         
         broadcaster.onClose( evSink ->    {
          
            System.out.println( "\nClose Connection.. \n " ) ;
  
            if ( ! evSink.isClosed() ) evSink.close()        ;
            if ( ! currentThread.isInterrupted() )
                   currentThread.interrupt()                 ;
         } ) ;
         
         broadcaster.onError( ( evSink , throwable ) ->  {
             
            System.out.println( "\nClient Error : "      + 
                                throwable.getMessage()   + 
                                " \n" )                  ;

            if ( ! evSink.isClosed() ) evSink.close()    ;

            if( ! currentThread.isInterrupted() )
                  currentThread.interrupt()              ;
             
            broadcaster.close() ;
         } ) ;
         
         TimerTask myTask = new TimerTask() {
             
            @Override
            public void run() {

               String statAsJsonString  =  toJsonString ( voteStats      )    ;
               
               broadcaster.broadcast ( sse.newEvent  (  statAsJsonString ) )  ;
            }
         } ;

         Timer timer = new Timer()          ;
        
         timer.schedule(myTask, 50 , 1000 ) ;
         
    }
    
     private static String toJsonString( Map<String, Integer> statVoteMap ) {
         
       return "[" + statVoteMap.entrySet().stream()
                               .map( e -> " { \"y\": "   + String.valueOf( e.getValue() + 
                                          ", \"label\":" + "\"" + e.getKey() ) + "\" }" )
                               .collect( Collectors.joining(", ") )            + " ]"   ;
    }
     
}