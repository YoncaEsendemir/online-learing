package com.eogrenme.starter;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@EntityScan(basePackages ={"com.eogrenme"})
@ComponentScan(basePackages ={"com.eogrenme"})
@EnableJpaRepositories(basePackages ={"com.eogrenme"})

@SpringBootApplication
public class OgrenmeBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(OgrenmeBackendApplication.class, args);
	}

}
