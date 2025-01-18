package com.eogrenme.configuration;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // CORS izinleri
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:5173")  // Frontend URL'si
                .allowedMethods("GET", "POST", "PUT", "DELETE")  // İzin verilen HTTP metodları
                .allowedHeaders("*")  // Tüm başlıkları kabul et
                .allowCredentials(true);  // Kimlik doğrulama için izin ver
    }
}