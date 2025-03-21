import KaibanBoard from "./components/KaibanBoard";

const uiSettings = {
    showExampleMenu: true,
    showShareOption: true,
    showSettingsOption: true,
    isPreviewMode: false,
    showSimpleShareOption: false,
};

function App() {
    return <KaibanBoard uiSettings={uiSettings} />;
}

export default App;
