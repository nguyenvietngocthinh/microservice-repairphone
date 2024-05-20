package iuh.edu.vn.services;

import iuh.edu.vn.models.User;
import iuh.edu.vn.models.dtos.UserCreateDto;
import iuh.edu.vn.models.dtos.UserUpdateDto;

import java.util.List;

public interface UserService {
    User createUser(UserCreateDto userCreateDto);
    User updateUser(int id, UserUpdateDto userUpdateDto);
    void deleteUser(int id);
    List<User> getAllUser();
    User getUserById(int id);
}
