# ddcarousel by Daniel
<section>
        <p>
          The sample carousel should be put in the section tag as example from <code>index.html</code>. For multiple carousels, the new section should be added together with its html tags underneath.
          The css classes are used in the script. Hence, they are should not changed for properly working.          
        </p>
        <p>
          Once new section tag and its container created, the id of <code>&lt;div class="carousel"&gt;</code> should be changed (e.g "carousel1") and should be declared in the ddcarousel.js file (refer to the last 2 lines) for using.
          <br>
          <code>const  el = document.getElementById("carousel");</code><br>
          <code>new DDCarousel(el);</code>
        </p>
        <p>
          This sample using media query to detect 3 common size: mobile (600), tablet (768) and desktop (1024). The section html tag will change the width accordingly based on screen size.
          However, user need to refresh the screen to get the effect as it require to re-render DOM element.
        </p>
      </section>
