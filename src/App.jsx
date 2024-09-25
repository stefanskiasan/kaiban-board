import KaibanDebugger from "./components/KaibanDebugger";
import KaibanBoard from './components/KaibanBoard';
import team from "./teams/product_specs/openai";

const uiSettings = {
    showFullScreen: true,
    showExampleMenu: true,
    showShareOption: true,
    showSettingsOption: true
};

function App() {
    return (
        <div className="mainContent">
            <h1>KaibanJS Playground</h1>
            <KaibanBoard uiSettings={uiSettings} />
            <KaibanDebugger team={team} />
        </div>
    );
}

export default App;