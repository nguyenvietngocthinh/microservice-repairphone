package iuh.edu.vn.models.dtos;

import lombok.Data;

@Data
public class UserUpdateDto {
    private String username;
    private String password;
    private String email;
}
