package lipunmyynti.ticketguru.model;

import jakarta.persistence.*;

@Entity
@Table(name = "postinumero")
public class Postinumero {

    @Id
    @Column(length = 5)
    private String postinumero;
    
    private String postitoimipaikka;

    public Postinumero() {
    }

    public Postinumero(String postinumero, String postitoimipaikka) {
        this.postinumero = postinumero;
        this.postitoimipaikka = postitoimipaikka;
    }

    public String getPostinumero() {
        return postinumero;
    }

    public void setPostinumero(String postinumero) {
        this.postinumero = postinumero;
    }

    public String getPostitoimipaikka() {
        return postitoimipaikka;
    }

    public void setPostitoimipaikka(String postitoimipaikka) {
        this.postitoimipaikka = postitoimipaikka;
    }

    @Override
    public String toString() {
        return "Postinumero [postinumero=" + postinumero
                + ", postitoimipaikka=" + postitoimipaikka + "]";
    }
}
