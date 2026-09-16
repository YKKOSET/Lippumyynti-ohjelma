package lipunmyynti.ticketguru.model;

import jakarta.persistence.*;


@Entity
@Table(name = "lipputyyppi")

public class Lipputyyppi 
{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_;
    private String nimi_;


    //constructors
    public Lipputyyppi()        {}

    public Lipputyyppi(Long id, String nimi)
    {
        id_ = id;
        nimi_ = nimi;
    }


    //setters and getters
    public Long getId_()                                { return id_; }

    public void setId_(Long id)                         { id_ = id; }

    public String getNimi_()                            { return nimi_; }

    public void setNimi_(String nimi)                   { nimi_ = nimi; }


    //to string method
    @Override
    public String toString() 
    {
        return "Lipputyyppi [id_=" + id_ + ", nimi_=" + nimi_ + "]";
    }
}
