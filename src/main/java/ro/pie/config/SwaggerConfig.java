package ro.pie.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.service.Contact;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;

@Controller
@Configuration
public class SwaggerConfig {

    @GetMapping("/")
    public String swaggerUI(){
        return "redirect:swagger-ui.html";
    }

    @Bean
    public ApiInfo apiInfo(){
        return new ApiInfoBuilder()
                .version("v1")
                .title("Coupons API")
                .build();
    }

    @Bean
    public Docket swaggerDocket(){
        return new Docket(DocumentationType.SWAGGER_2)
                .apiInfo(apiInfo())
                .groupName("v1")
                .select()
                .apis(RequestHandlerSelectors.any())
                .paths(PathSelectors.ant("/api/v1/**"))
                .build()
                .useDefaultResponseMessages(false)
                .pathMapping("/");

    }
}

