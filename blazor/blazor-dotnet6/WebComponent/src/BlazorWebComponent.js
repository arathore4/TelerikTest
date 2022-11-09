import { html, LitElement } from "lit";
import "./blazor.server.js";

function script(src) {
  let el = document.createElement('script');
  el.src = src;
  return el;
}

class BlazorWebComponent extends LitElement {
  constructor() {
    super();
  }

  firstUpdated() {
    super.firstUpdated();

    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
      Blazor.start({
        configureSignalR: (builder) => builder.withUrl("_blazor", 4),
      });
    } else {
      Blazor.start({
        configureSignalR: (builder) => builder.withUrl("_blazor"),
      });
    }
  }
  
  render() {
    return html` 
    <link rel='stylesheet' href="./blazor-web-component.css" />
    <blazor-home-element> </blazor-home-element>
    `;
  }
}
window.customElements.define("blazor-web-component", BlazorWebComponent);
