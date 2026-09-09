package lipunmyynti.ticketguru.model;

import java.util.List;
import jakarta.persistence.*;

@Entity
@Table(name = "tapahtuma")
public class Tapahtuma {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nimi;

    @ManyToOne
    private Jarjestaja jarjestaja;
    
    @OneToMany(mappedBy = "tapahtuma")
    private List<Esityskerta> esityskerrat;

    public Tapahtuma() {
    }

    public Tapahtuma(String nimi) {
        this.nimi = nimi;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setNimi(String nimi) {
        this.nimi = nimi;
    }

    public void setJarjestaja(Jarjestaja jarjestaja) {
        this.jarjestaja = jarjestaja;
    }

    public Long getId() {
        return id;
    }

    public String getNimi() {
        return nimi;
    }

    public Jarjestaja getJarjestaja() {
        return jarjestaja;
    }

    public List<Esityskerta> getEsityskerrat() {
        return esityskerrat;
    }

    public void addEsityskerta(Esityskerta esityskerta) {
        this.esityskerrat.add(esityskerta);
    }

    @Override
    public String toString() {
        return "Tapahtuma [id=" + id + ", nimi=" + nimi + ", jarjestaja=" + jarjestaja + ", esityskerrat="
                + esityskerrat + "]";
    }

    


    
}
