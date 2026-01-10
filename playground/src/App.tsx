import { useState } from "react";
import { MjmlEditor } from "@savvycal/mjml-editor";
import "@savvycal/mjml-editor/styles.css";

const initialMjml = `<mjml>
  <mj-body>
    <mj-section background-color="#f4f4f4">
      <mj-column>
        <mj-text font-size="24px" color="#333333" align="center">
          Welcome to the MJML Editor
        </mj-text>
      </mj-column>
    </mj-section>
    <mj-section>
      <mj-column>
        <mj-image src="https://via.placeholder.com/600x300" alt="Hero image" />
        <mj-text>
          This is a visual editor for MJML email templates. You can select blocks to edit their properties in the inspector panel on the right.
        </mj-text>
        <mj-button href="https://example.com" background-color="#007bff">
          Learn More
        </mj-button>
      </mj-column>
    </mj-section>
    <mj-section>
      <mj-column>
        <mj-divider border-color="#dddddd" />
        <mj-spacer height="20px" />
        <mj-text font-size="12px" color="#888888" align="center">
          Footer text goes here
        </mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>`;

function App() {
  const [mjml, setMjml] = useState(initialMjml);

  return (
    <div className="h-screen w-screen">
      <MjmlEditor
        value={mjml}
        onChange={(mjml) => {
          setMjml(mjml);
          console.log(mjml);
        }}
      />
    </div>
  );
}

export default App;
