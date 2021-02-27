import HypernetWebIntegration, { IHypernetWebIntegration } from "@hypernetlabs/web-integration";
import Spinner from "./assets/loading-spinner";

const client: IHypernetWebIntegration = new HypernetWebIntegration();

// set image background styles
var style = document.createElement("style");
style.innerHTML = `body {
  background-image: url(https://res.cloudinary.com/dqueufbs7/image/upload/v1614365921/images/Artboard_3_1.png);
  height: 100%;
  background-repeat: no-repeat;
  background-size: cover;
  background-color: #F9F9F9;
}`;

// Get the first script tag
var ref = document.querySelector("script");
ref?.parentNode?.insertBefore(style, ref);

Spinner();
Spinner.show();
client.getReady().map(() => {
  Spinner.hide();
  client.renderConnectorAuthorizationFlow({ connectorUrl: "http://localhost:5010", showInModal: true });
});
