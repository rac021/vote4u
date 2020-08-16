
package com.rac021.jaxy.api.qualifiers ;

import java.lang.annotation.Target ;
import java.lang.annotation.Retention ;
import javax.transaction.Transactional ;
import java.lang.annotation.ElementType ;
import javax.enterprise.inject.Stereotype ;
import java.lang.annotation.RetentionPolicy ;
import javax.enterprise.context.RequestScoped ;

/**
 *
 * @author ryahiaoui
 */
@Stereotype
@Transactional
@RequestScoped
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
public @interface Stateless {}    
