
package com.rac021.jaxy.api.exceptions;

/**
 *
 * @author ryahiaoui
 */

public class UnAuthorizedResourceException extends BusinessException {

    private static final long serialVersionUID = 1L      ;
    
    public UnAuthorizedResourceException(String message) {
        super( message )                                 ;
    }    
}

