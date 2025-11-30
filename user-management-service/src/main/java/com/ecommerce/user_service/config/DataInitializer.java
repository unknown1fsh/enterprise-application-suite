package com.ecommerce.user_service.config;

import com.ecommerce.user_service.domain.entity.User;
import com.ecommerce.user_service.domain.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        // Varsayılan admin kullanıcısı oluştur
        if (!userRepository.existsByUsernameAndDeletedFalse("admin")) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setEmail("admin@example.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setFirstName("Admin");
            admin.setLastName("User");
            admin.setRole(User.UserRole.ADMIN);
            admin.setActive(true);
            userRepository.save(admin);
            System.out.println("✓ Varsayılan admin kullanıcısı oluşturuldu (kullanıcı adı: admin, şifre: admin123)");
        }

        // Varsayılan normal kullanıcı oluştur
        if (!userRepository.existsByUsernameAndDeletedFalse("user")) {
            User user = new User();
            user.setUsername("user");
            user.setEmail("user@example.com");
            user.setPassword(passwordEncoder.encode("user123"));
            user.setFirstName("Test");
            user.setLastName("User");
            user.setRole(User.UserRole.USER);
            user.setActive(true);
            userRepository.save(user);
            System.out.println("✓ Varsayılan kullanıcı oluşturuldu (kullanıcı adı: user, şifre: user123)");
        }
    }
}
