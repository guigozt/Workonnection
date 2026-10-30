package com.workonnection.backend.dto;

import com.workonnection.backend.model.StatusCandidatura;

public class StatusUpdateDTO {
    private StatusCandidatura status;

    public StatusUpdateDTO() {}

    public StatusUpdateDTO(StatusCandidatura status) {
        this.status = status;
    }

    public StatusCandidatura getStatus() {
        return status;
    }

    public void setStatus(StatusCandidatura status) {
        this.status = status;
    }
}
