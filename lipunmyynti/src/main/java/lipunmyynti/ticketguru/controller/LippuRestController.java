package lipunmyynti.ticketguru.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.google.zxing.WriterException;

import jakarta.validation.Valid;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;

import lipunmyynti.ticketguru.model.*;
import lipunmyynti.ticketguru.repository.EsityskertaRepository;
import lipunmyynti.ticketguru.repository.LippuRepository;
import lipunmyynti.ticketguru.repository.LipputyyppiRepository;
import lipunmyynti.ticketguru.service.QrCodeService;

import java.io.IOException;
import java.net.URI;
import java.util.*;
import org.springframework.web.bind.annotation.RequestParam;


@Validated
@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/liput") // http://localhost:8080/api/liput

public class LippuRestController {

    // injection: repository to restcontroller
    private final LippuRepository lippuRepository;
    private final QrCodeService qrCodeService;
    private final EsityskertaRepository esityskertaRepository;
    private final LipputyyppiRepository lipputyyppiRepository;

    public LippuRestController(LippuRepository lippuRepository, EsityskertaRepository esityskertaRepository,
            LipputyyppiRepository lipputyyppiRepository, QrCodeService qrCodeService) {
        this.lippuRepository = lippuRepository;
        this.qrCodeService = qrCodeService;
        this.esityskertaRepository = esityskertaRepository;
        this.lipputyyppiRepository = lipputyyppiRepository;
    }

    @GetMapping
    public List<Lippu> getAllLiput() {
        return lippuRepository.findAll();
    }

    //Search lippu with id
    @GetMapping("/{id}")
    public Lippu getLippuById(@PathVariable UUID id) {
        return lippuRepository.findById(id).orElse(null);
    }

    //Merkitse lippu käytetyksi
    @PatchMapping("/{id}/kaytetty")
    public ResponseEntity<Lippu> merkitseKaytetyksi(@PathVariable UUID id) {
        Optional<Lippu> kasiteltavaLippu = lippuRepository.findById(id);

        if (kasiteltavaLippu.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Lippu lippu = kasiteltavaLippu.get();
        lippu.setKaytetty(true);
        lippuRepository.save(lippu);

        return ResponseEntity.ok(lippu);
    }

    //Merkitse lippu käyttämättömäksi
    @PatchMapping("/{id}/kayttamaton")
    public ResponseEntity<Lippu> merkitseKayttamattomaksi(@PathVariable UUID id) {
        Optional<Lippu> kasiteltavaLippu = lippuRepository.findById(id);

        if (kasiteltavaLippu.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Lippu lippu = kasiteltavaLippu.get();
        lippu.setKaytetty(false);
        lippuRepository.save(lippu);

        return ResponseEntity.ok(lippu);
    }

    // Merkitse lippu ostetuksi
    @PatchMapping("/{id}/ostettu")
    public ResponseEntity<Lippu> merkitseOstetuksi(@PathVariable UUID id) {
        Optional<Lippu> kasiteltavaLippu = lippuRepository.findById(id);

        if (kasiteltavaLippu.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Lippu lippu = kasiteltavaLippu.get();
        lippu.setOstettu(true);
        lippuRepository.save(lippu);
        return ResponseEntity.ok(lippu);
    }

    //Merkitse lippu ostamattomaksi
    @PatchMapping("/{id}/ostamaton")
    public ResponseEntity<Lippu> merkitseOstamattomaksi(@PathVariable UUID id) {
        Optional<Lippu> kasiteltavaLippu = lippuRepository.findById(id);

        if (kasiteltavaLippu.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Lippu lippu = kasiteltavaLippu.get();
        lippu.setOstettu(false);
        lippuRepository.save(lippu);

        return ResponseEntity.ok(lippu);
    }

    @GetMapping("/{id}/qr")
    public ResponseEntity<byte[]> getLippuQr(@PathVariable UUID id) throws WriterException, IOException {

        Optional <Lippu> lippu = lippuRepository.findById(id);

        if(lippu.isEmpty()){
            return ResponseEntity.notFound().build();
        }

        byte[] png = qrCodeService.qrgen(lippu.get().getId().toString(), 300, 300);
        return ResponseEntity.ok()
        .contentType(MediaType.IMAGE_PNG)
        .body(png);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> poistaLippu(@PathVariable UUID id) {
        if (!lippuRepository.existsById(id)) {
        return ResponseEntity.notFound().build();
    }

    lippuRepository.deleteById(id);
    return ResponseEntity.noContent().build();
}

@PostMapping
public ResponseEntity<Lippu> luoLippu(@Valid @RequestBody Lippu lippu) {
    Optional<Esityskerta> esityskerta = esityskertaRepository.findById(lippu.getEsityskerta().getId());
    Optional<Lipputyyppi> lipputyyppi = lipputyyppiRepository.findById(lippu.getLipputyyppi().getId_());

    if (esityskerta.isEmpty() || lipputyyppi.isEmpty()) {
        return ResponseEntity.badRequest().build();
    }

    lippu.setId(null); // varmistaa, että luodaan uusi eikä päivitetä vanhaa
    lippu.setEsityskerta(esityskerta.get());
    lippu.setLipputyyppi(lipputyyppi.get());

    Lippu tallennettu = lippuRepository.save(lippu);

    URI location = ServletUriComponentsBuilder.fromCurrentRequest()
            .path("/{id}")
            .buildAndExpand(tallennettu.getId())
            .toUri();

    return ResponseEntity.created(location).body(tallennettu);
}

@PutMapping("/{id}")
public ResponseEntity<Lippu> paivitaLippu(@PathVariable UUID id, @Valid @RequestBody Lippu uusiLippu) {
    Optional<Lippu> olemassaOleva = lippuRepository.findById(id);
    if (olemassaOleva.isEmpty()) {
        return ResponseEntity.notFound().build();
    }

    Optional<Esityskerta> esityskerta = esityskertaRepository.findById(uusiLippu.getEsityskerta().getId());
    Optional<Lipputyyppi> lipputyyppi = lipputyyppiRepository.findById(uusiLippu.getLipputyyppi().getId_());

    if (esityskerta.isEmpty() || lipputyyppi.isEmpty()) {
        return ResponseEntity.badRequest().build();
    }

    Lippu lippu = olemassaOleva.get();
    lippu.setHinta(uusiLippu.getHinta());
    lippu.setKaytetty(uusiLippu.isKaytetty());
    lippu.setOstettu(uusiLippu.isOstettu());
    lippu.setEsityskerta(esityskerta.get());
    lippu.setLipputyyppi(lipputyyppi.get());

    return ResponseEntity.ok(lippuRepository.save(lippu));
}
    
}