package com.JerryLibrary.springbootlibrary.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

import com.JerryLibrary.springbootlibrary.entity.Book;
import com.JerryLibrary.springbootlibrary.entity.Message;
import com.JerryLibrary.springbootlibrary.entity.Review;

@Configuration
public class MyDataRestConfig implements RepositoryRestConfigurer {

    private String theAllowedOrigins = "https://localhost:3000";

    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {

        // unsupport fucntion
        HttpMethod[] theUnsupportedActions = {
                HttpMethod.POST,
                HttpMethod.PATCH,
                HttpMethod.DELETE,
                HttpMethod.PUT
        };

        // expose a ID so that user is able to check it
        config.exposeIdsFor(Book.class);
        config.exposeIdsFor(Review.class);
        config.exposeIdsFor(Message.class);

        // disable the functions for get pust delete
        disableHttpMethods(Book.class, config, theUnsupportedActions);
        disableHttpMethods(Review.class, config, theUnsupportedActions);
        disableHttpMethods(Message.class, config, theUnsupportedActions);

        /*
         * Configure CORS Mapping
         * configures CORS settings to allow requests from the theAllowedOrigins origin
         * for all paths under the base path of the application.
         * It sets up CORS configuration to avoid cross-origin restrictions.
         */
        /*CORS is a security feature implemented by web browsers that
         restricts web pages from making requests to a different domain (origin) than the one that served the web page. 
        It's a way to prevent potential security vulnerabilities 
        /** means all roads*/
        /* config.getBasePath() get /api from http://localhost:8080/api, /** means all roads  allowedOrigins allowing requests from a website hosted at http://localhost:3000.*/
        cors.addMapping(config.getBasePath() + "/**")
                .allowedOrigins(theAllowedOrigins);

    }

    private void disableHttpMethods(Class theClass, RepositoryRestConfiguration config,
            HttpMethod[] theUnsupportedActions) {
        config.getExposureConfiguration()
                // Specifies the class for which exposure configuration is being set.
                .forDomainType(theClass)

                // Configures exposure settings for individual items of the class.
                .withItemExposure((metdata, httpMethods) -> httpMethods.disable(theUnsupportedActions))

                // Configures exposure settings for collections of the class.
                .withCollectionExposure((metdata, httpMethods) -> httpMethods.disable(theUnsupportedActions));
    }
}
