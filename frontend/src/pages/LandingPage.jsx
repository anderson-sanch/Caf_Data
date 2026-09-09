import cafe from "../imagenes/CAFE_MENU..jpg";
import comida from "../imagenes/COMIDA_MENU.jpg";
import malteada from "../imagenes/frape.webp";
import tasa from "../imagenes/tasa de cafe.jpg";
import { useNavigate } from "react-router-dom";


function LandingPage (){
const navigate = useNavigate();

return(
    <div>
      <header className="navbar">
         <div className="logo">CafData</div>
         <nav>
           <ul>
             <li><a href="#">Inicio</a></li>
             <li><a href="#">Menú</a></li>
             <li><a href="#">Sobre nosotros</a></li>
             <li><a href="#">Contacto</a></li>
           </ul>
         </nav>
        <button
          type="button"
          className="login-buttom"
          onClick={() => navigate("/login")}
        >
          Iniciar
        </button>
      </header>


        <section className="hero">
            <div className="hero-content">
            <h1>El cafe perfecto para el mejor momento</h1>
            <p>Disfuta de una experiencia única en nuestra cafetéria acogedora.</p>
            <button type="button">Ver menu</button>
            </div>
        </section>

        <section className="menu-section">
           <h2>Disfrurta nuestro delicioso menu</h2>
           
         <div className="cards">

           <div className="card">
              <img src={cafe} />
               <h3> Bedidas </h3>
               <p>varidad de cafes y bebidas calientes y frias</p>
               <button type="button">ver bebidas</button>
          </div>

           <div className="card">
              <img src={comida} />
               <h3>comida</h3>
               <p>Deliciosos pasteles,bocadillos y postres recien horneados.</p>
               <button type="button">ver comida</button>
          </div>
 
           <div className="card">
              <img src={malteada} />
               <h3>Ofertas especiales</h3>
               <p>Promociones y descuentosa exclusivos para ti.</p>
               <button type="button">Ver ofertas</button>
          </div>
          
         </div>
        
        </section>
        <section className="highlight">
          <div className="highlight-text">
            <h2>Prueba nuestro Caramel Macchiato</h2>
            <p>Una deliciosa mezcla de espreso,leche vaporizada y caramelo con miel.</p>
            <button>Ordenar ahora</button>
          </div>

          <div className="highlight-image">
            <img src={tasa} alt="Caramel Macchiato" />
        </div>
        </section>

        <section className="final-cta">
          <div className="final-overlay">
            <h2>Vive la magia del cafe</h2>
            <p>Un lugar perfecto para trabajar o disfrutar de un buen momento con un cafe </p>
            <button>Como llegar</button>
          </div>
        </section>
    </div>
)
}
export default LandingPage;
