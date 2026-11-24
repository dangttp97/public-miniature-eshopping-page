import "./styles/tokens.css";
import "./styles/global.css";

import { mount } from "@koniwa/core";

import { App } from "./App";
import { markLandingEntry } from "./lib/navigation";

markLandingEntry();
mount(<App />, document.getElementById("root")!);
