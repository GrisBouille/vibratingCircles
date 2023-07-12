import './settingsPanel.css'
export {};

class SettingsPanel extends HTMLElement {
  private el: HTMLElement = document.createElement("div");
  private isMouseOverPanel: boolean = false;

  constructor() {
    super();
    // initialize your class here
    // create the panel element
    this.el.id = "settingsPanel";

    let panelTitle = document.createElement('div');
    panelTitle.className = "settingsTitle"
    panelTitle.innerHTML = "Settings"
    this.el.appendChild(panelTitle);
    document.body.appendChild(this.el);
    let panel = this;
    panel.isMouseOverPanel = false;
    panel.el.addEventListener("mouseenter", () => {
      panel.isMouseOverPanel = true;
    });

    panel.el.addEventListener("mouseleave", () => {
      panel.isMouseOverPanel = false;
      // Slide the control panel out when the mouse leaves the panel.
      panel.el.style.right = "-250px";
    });

    document.addEventListener("mousemove", (event) => {
        let x = event.clientX;
        let windowWidth = window.innerWidth;
      
        // If the mouse is within 7 pixels of the right edge...
        if (windowWidth - x <= 27 || panel.isMouseOverPanel) {
          panel.el.style.right = "0"; // Slide the control panel in.
          panel.el.style.paddingLeft = "15px";
        } else {
          panel.el.style.right = "-223px"; // Slide the control panel out.
          panel.el.style.paddingLeft = "30px";
        }
      });
  }

  // Add methods for your class here
  addSetting(labelText: string, inputElement: HTMLInputElement, linkedValue: {value:any}, callback: any) {
    let sliderContainer = document.createElement('div');
    sliderContainer.className = "slider-container";

    let label = document.createElement('label');
    label.htmlFor = inputElement.id;
    label.textContent = labelText;

    let span1 = document.createElement('span');
    span1.textContent = "(";

    let spanValue = document.createElement('span');
    spanValue.className = "slider-value";
    spanValue.textContent = inputElement.value;

    let span2 = document.createElement('span');
    span2.textContent = ")";

    let input = inputElement;
    input.addEventListener("input", function () {
      if(typeof linkedValue.value === "number") {
        linkedValue.value = parseFloat(this.value); // Log the current value of the slider.
      } else if(typeof linkedValue.value === "boolean") {
        linkedValue.value = this.checked; // Log the current value of the slider.
      } else {
        linkedValue.value = this.value;
      }
        spanValue.textContent = this.value;
        if (callback !== null) callback();
        // You can use this value to adjust aspects of your animation.
      });

    sliderContainer.appendChild(label);
    sliderContainer.appendChild(span1);
    sliderContainer.appendChild(spanValue);
    sliderContainer.appendChild(span2);
    sliderContainer.appendChild(input);
    this.el.appendChild(sliderContainer);
  }
}
customElements.define('settings-panel', SettingsPanel);

export default SettingsPanel;
