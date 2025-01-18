package com.eogrenme.dto;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class DtoCategoryUI {

      @JsonProperty("id")
    private Long id;

    @NotBlank(message = "Kategori girmek zorunludur")
    private String name;

    private String description;

}
