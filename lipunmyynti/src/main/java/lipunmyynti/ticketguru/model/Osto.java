package lipunmyynti.ticketguru.model;

import java.sql.Timestamp;

import jakarta.persistence.*;


@Entity 
@Table (name = "osto")

public class Osto {

@Id 
@GeneratedValue (strategy = GenerationType.IDENTITY)
private Long id;

private Timestamp ostoaika;
private double kokonaishinta;

@ManyToOne 
private Asiakas asiakas;

public Osto() {
}

public Osto(Timestamp ostoaika, double kokonaishinta, Asiakas asiakas) {
    this.ostoaika = ostoaika;
    this.kokonaishinta = kokonaishinta;
    this.asiakas = asiakas;
}

public Long getId() {
    return id;
}

public void setId(Long id) {
    this.id = id;
}

public Timestamp getOstoaika() {
    return ostoaika;
}

public void setOstoaika(Timestamp ostoaika) {
    this.ostoaika = ostoaika;
}

public double getKokonaishinta() {
    return kokonaishinta;
}

public void setKokonaishinta(double kokonaishinta) {
    this.kokonaishinta = kokonaishinta;
}

public Asiakas getAsiakas() {
    return asiakas;
}

public void setAsiakas(Asiakas asiakas) {
    this.asiakas = asiakas;
}

@Override
public String toString() {
    return "Osto [id=" + id + ", ostoaika=" + ostoaika + ", kokonaishinta=" + kokonaishinta + ", asiakas=" + asiakas
            + "]";
}


}
