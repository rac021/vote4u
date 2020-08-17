/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.rac021.jaxy.impl.service.vote;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import java.util.stream.Stream;

/**
 *
 * @author ryahiaoui
 */
public class Test {
    
    public static final ConcurrentMap<String, Integer> voteStats = new ConcurrentHashMap<>() ;
    
    public static void main( String[] args ) {
        
        String animators = "rachid, antoine, viviane " ;
        
         String[] animatorsNames = animators.split( "," ) ;
        
        voteInc(animatorsNames) ;
        
        animators = "rachid,  viviane " ;
         
        voteInc(animatorsNames) ;
        
        System.out.println( " voteStats ==>  " + voteStats  );
       
        
        animators = " viviane " ;
         
        voteInc(animatorsNames) ;
        
        System.out.println( " voteStats ==>  " + voteStats  );
       
       
    }

    private static void voteInc( String[] animatorsNames ) {
        Stream.of( animatorsNames ).forEach( animator -> {
            voteStats.compute( animator.trim().toLowerCase()       ,
                               ( k, v ) -> v == null ? 1 : v + 1 ) ;
            
        } ) ;
    }
}
