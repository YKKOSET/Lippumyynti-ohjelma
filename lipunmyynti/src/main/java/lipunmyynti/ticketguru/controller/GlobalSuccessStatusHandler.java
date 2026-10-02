package lipunmyynti.ticketguru.controller;

import org.springframework.core.MethodParameter;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyAdvice;

@RestControllerAdvice
public class GlobalSuccessStatusHandler implements ResponseBodyAdvice<Object> 
{

    @Override
    public boolean supports(MethodParameter returnType, Class<? extends HttpMessageConverter<?>>  converterType) 
    {
        // Ohitetaan ResponseEntity: sen status on jo päätetty
        return !ResponseEntity.class.isAssignableFrom(returnType.getParameterType());
    }

    @Override
    public Object beforeBodyWrite(Object body, MethodParameter returnType,
        MediaType contentType,
        Class<? extends HttpMessageConverter<?>> converterType,
        ServerHttpRequest request, ServerHttpResponse response) 
    {

        HttpMethod method = request.getMethod();

        if (HttpMethod.POST.equals(method))
            response.setStatusCode(HttpStatus.CREATED);          // 201
        else if (HttpMethod.DELETE.equals(method) || body == null)
            response.setStatusCode(HttpStatus.NO_CONTENT);       // 204
        // 200
        return body;
    }
}
    