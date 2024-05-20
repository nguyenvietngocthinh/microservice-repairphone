package iuh.edu.vn.config;

import iuh.edu.vn.enums.Role;
import iuh.edu.vn.models.User;
import iuh.edu.vn.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;


import java.util.HashSet;

@Configuration
@Slf4j
public class ApplicationInitConfig {

    @Bean
    ApplicationRunner applicationRunner(UserRepository userRepository){
        return args -> {
            if(userRepository.findUserByUsername("admin").isEmpty()){
                var roles = new HashSet<String>();
                roles.add(Role.ADMIN.name());

                User user = User.builder()
                        .username("admin")
                        .password(new BCryptPasswordEncoder(10).encode("admin"))
                        .roles(roles)
                        .build();

                userRepository.save(user);
                log.warn("Admin user created with username: admin and password: admin ! please change password");
            }
        };
    }
}
