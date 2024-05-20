package iuh.edu.vn.services.impl;

import iuh.edu.vn.enums.Role;
import iuh.edu.vn.models.User;
import iuh.edu.vn.models.dtos.UserCreateDto;
import iuh.edu.vn.models.dtos.UserUpdateDto;
import iuh.edu.vn.repository.UserRepository;
import iuh.edu.vn.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;


@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserRepository userRepository;

    @Override
    public User createUser(UserCreateDto userCreateDto) {
        // Kiểm tra xem người dùng đã tồn tại hay chưa
        if (userRepository.existsByUsername(userCreateDto.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        User user = new User();

        user.setUsername(userCreateDto.getUsername());
        user.setEmail(userCreateDto.getEmail());

        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
        user.setPassword(passwordEncoder.encode(userCreateDto.getPassword()));

        HashSet<String> roles = new HashSet<>();
        roles.add(Role.USER.name());

        user.setRoles(roles);

        return userRepository.save(user);
    }

    @Override
    public User updateUser(int id, UserUpdateDto userUpdateDto) {
        User user = getUserById(id);

        user.setUsername(userUpdateDto.getUsername());

        user.setEmail(userUpdateDto.getEmail());

        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
        user.setPassword(passwordEncoder.encode(userUpdateDto.getPassword()));

        return userRepository.save(user);
    }

    @Override
    public void deleteUser(int id) {
        userRepository.deleteById(id);
    }

    @Override
    public List<User> getAllUser() {
        return userRepository.findAll();
    }

    @Override
    public User getUserById(int id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
