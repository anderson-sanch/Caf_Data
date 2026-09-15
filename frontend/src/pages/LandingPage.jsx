import cafe from "../imagenes/CAFE_MENU..jpg";
import comida from "../imagenes/COMIDA_MENU.jpg";
import malteada from "../imagenes/frape.webp";
import tasa from "../imagenes/tasa de cafe.jpg";
import { Link } from "react-router-dom";


function LandingPage (){

return(
    <div>
      <header className="navbar">
         <div className="logo">CafData</div>
         <nav>
           <ul>
             <li><a href="#inicio">Inicio</a></li>
             <li><a href="#menu">Menú</a></li>
             <li><a href="#sobre-nosotros">Sobre nosotros</a></li>
             <li><a href="#contacto">Contacto</a></li>
           </ul>
         </nav>
        <Link className="login-buttom" to="/login">Iniciar sesión</Link>
      </header>


        <section className="hero" id="inicio">
            <div className="hero-content">
            <h1>El cafe perfecto para el mejor momento</h1>
            <p>Disfuta de una experiencia única en nuestra cafetéria acogedora.</p>
            <a href="#menu">Ver menú</a>
            </div>
        </section>

        <section className="menu-section" id="menu">
           <h2>Disfrurta nuestro delicioso menu</h2>
           
         <div className="cards">

           <div className="card">
              <img src={cafe} alt="Bebidas de café" />
               <h3> Bedidas </h3>
               <p>varidad de cafes y bebidas calientes y frias</p>
          </div>

           <div className="card">
              <img src={comida} alt="Pasteles y comida" />
               <h3>comida</h3>
               <p>Deliciosos pasteles,bocadillos y postres recien horneados.</p>
          </div>
 
           <div className="card">
              <img src={malteada} alt="Bebidas frías" />
               <h3>Ofertas especiales</h3>
               <p>Promociones y descuentosa exclusivos para ti.</p>
          </div>
          
         </div>
        
        </section>
        <section className="highlight" id="sobre-nosotros">
          <div className="highlight-text">
            <h2>Prueba nuestro Caramel Macchiato</h2>
            <p>Una deliciosa mezcla de espreso,leche vaporizada y caramelo con miel.</p>
          </div>

          <div className="highlight-image">
            <img src={tasa} alt="Caramel Macchiato" />
        </div>
        </section>

        <section className="final-cta" id="contacto">
          <div className="final-overlay">
            <h2>Vive la magia del cafe</h2>
            <p>Un lugar perfecto para trabajar o disfrutar de un buen momento con un cafe </p>
          </div>
        </section>
    </div>
)
}
export default LandingPage;
