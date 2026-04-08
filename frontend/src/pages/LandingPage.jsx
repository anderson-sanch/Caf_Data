import cafe from "../imagenes/CAFE_MENU.jpg";
import comida from "../imagenes/COMIDA_MENU.jpg";
import malteada from "../imagenes/Maldeada.jpg";
import tasa from "../imagenes/tasa de cafe.jpg";


function LandingPage (){

return(
    <div>
        <section className="hero">
            <h1>El cafe perfecto para el mejor momento</h1>
            <p>Disfuta de una experiencia única en nuestra cafetéria acogedora.</p>
            <button type="button">Menu</button>
        </section>

        <section className="menu-section">
           <h2>Disfrurta nuestro <span>delicioso</span>menu
           </h2>
           
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
               <button type="button">Ver ofertad</button>
          </div>
          
         </div>
        
        </section>
        <section className="highlight">
          <div>
            <h2>caramel Macchiato</h2>
            <p>Una deliciosa mezcla de espreso,leche vaporizada y caramelo con miel.</p>
            <button>Ordenar ahora</button>
          </div>

          <div className=".highlight-image">
            <img src={tasa}  />
          </div>
        </section>

        <section className="final-cta">
          <div>
            <h2>Vive la magia del cafe</h2>
            <p>Un lugar perfecto para trabajar o disfrutar de un buen momento con un cafe </p>
            <button>Como llegar</button>
          </div>
        </section>
    </div>
)
}
export default LandingPage;