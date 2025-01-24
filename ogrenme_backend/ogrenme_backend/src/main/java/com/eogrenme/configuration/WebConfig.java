package com.eogrenme.configuration;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

    /*Bu sınıfın bir Spring yapılandırma sınıfı olduğunu belirtir.
    Spring uygulamasının başlangıcında bu sınıf yüklenir ve CORS ayarları uygulanır. */
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