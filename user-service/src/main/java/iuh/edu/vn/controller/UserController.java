package iuh.edu.vn.controller;

import iuh.edu.vn.models.User;
import iuh.edu.vn.models.dtos.UserCreateDto;
import iuh.edu.vn.models.dtos.UserUpdateDto;
import iuh.edu.vn.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "http://127.0.0.1:5500/")
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping
    User createUser(@RequestBody UserCreateDto userCreateDto){
        return userService.createUser(userCreateDto);
    }

    @GetMapping
    List<User> getUsers(){
        return userService.getAllUser();
    }

    @GetMapping("/{userId}")
    User getUser(@PathVariable("userId") int id){
        return userService.getUserById(id);
    }

    @PutMapping("/{userId}")
    User updateUser(@PathVariable int id, @RequestBody UserUpdateDto userUpdateDto){
        return userService.updateUser(id, userUpdateDto);
    }

    @DeleteMapping("/{id}")
    String deleteUser(@PathVariable int id){
        userService.deleteUser(id);
        return "User has been deleted";
    }
}
