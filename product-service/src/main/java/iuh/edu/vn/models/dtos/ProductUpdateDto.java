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
public class ProductUpdateDto {
    private int id;

    private String phoneName;
    private Set<String> status;
    private Set<String> process;
    private String notes;
    private List<ProductComponentDto> components;
}
