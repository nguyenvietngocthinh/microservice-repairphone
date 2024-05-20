package iuh.edu.vn.models.dtos;

import iuh.edu.vn.models.ProductComponent;
import jakarta.persistence.CascadeType;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import lombok.Data;

import java.util.List;
import java.util.Set;

@Data
public class ProductCreateDto {
    private int id;

    private String phoneName;
    private String description;
    private Set<String> status;
    private String notes;
    private int userId;

}
