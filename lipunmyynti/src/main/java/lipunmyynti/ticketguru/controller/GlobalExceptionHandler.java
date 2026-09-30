package lipunmyynti.ticketguru.controller;

import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

import lipunmyynti.ticketguru.model.ApiError;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ApiError> handleResponseStatusException(
            ResponseStatusException ex) {

        ApiError error = new ApiError(
                ex.getStatusCode().value(),
                ex.getReason());

        return ResponseEntity
                .status(ex.getStatusCode())
                .body(error);
    }
}