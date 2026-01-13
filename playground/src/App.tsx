import { useState } from 'react';
import { MjmlEditor, type LiquidSchema } from '@savvycal/mjml-editor';

// Sample Liquid schema for testing autocomplete
const liquidSchema: LiquidSchema = {
  variables: [
    { name: 'user.name', description: 'The name of the recipient' },
    { name: 'user.email', description: 'Email address of the recipient' },
    { name: 'user.first_name', description: 'First name of the recipient' },
    { name: 'appointment.title', description: 'Title of the appointment' },
    {
      name: 'appointment.date',
      description: 'Formatted date of the appointment',
    },
    {
      name: 'appointment.time',
      description: 'Formatted time of the appointment',
    },
    { name: 'appointment.duration', description: 'Duration in minutes' },
    { name: 'appointment.location', description: 'Meeting location or URL' },
    { name: 'organizer.name', description: 'Name of the meeting organizer' },
    { name: 'organizer.email', description: 'Email of the meeting organizer' },
  ],
  tags: [
    { name: 'if', description: 'Conditional block - {% if condition %}' },
    { name: 'endif', description: 'End conditional block' },
    { name: 'else', description: 'Else branch of conditional' },
    { name: 'elsif', description: 'Else-if branch - {% elsif condition %}' },
    { name: 'for', description: 'Loop block - {% for item in array %}' },
    { name: 'endfor', description: 'End loop block' },
    {
      name: 'unless',
      description: 'Negative conditional - {% unless condition %}',
    },
    { name: 'endunless', description: 'End unless block' },
  ],
};

const initialMjml = `

<mjml>
  <mj-head>
    <mj-title>Your appointment is scheduled</mj-title>
    <mj-attributes>
      <mj-all font-family="ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji, sans-serif" />
      <mj-text line-height="1.5" />
    </mj-attributes>
  </mj-head>

  <mj-body background-color="#f4f4f5">
    <!-- Spacer -->
    <mj-section padding="20px 0 0 0"></mj-section>

    <!-- Main Container -->
    <mj-wrapper background-color="#ffffff" border-radius="8px" padding="0">
      <!-- Header -->
      <mj-section padding="32px 16px">
        <mj-column>
          <mj-text font-size="24px" font-weight="600" color="#09090b" line-height="1.3">
            Your appointment is scheduled
          </mj-text>
        </mj-column>
      </mj-section>

      <!-- Appointment Details Card -->
      <mj-section padding="0 40px">
        <mj-column background-color="#fafafa" border-radius="6px" border="1px solid #e4e4e7" padding="24px">

          <!-- Appointment Type -->
          <mj-text font-size="14px" font-weight="500" color="#52525c" text-transform="uppercase" letter-spacing="0.5px" padding="0 0 8px 0">
            30-Minute Consultation
          </mj-text>

          <!-- Date -->
          <mj-text font-size="18px" font-weight="600" color="#09090b" line-height="1.4" padding="0">
            Tuesday, January 14, 2025
          </mj-text>

          <!-- Time -->
          <mj-text font-size="16px" color="#52525c" line-height="1.4" padding="4px 0 0 0">
            2:00 PM – 2:30 PM (EST)
          </mj-text>

          <!-- Add to Calendar Button -->
          <mj-button href="#" background-color="#09090b" color="#ffffff" font-size="14px" font-weight="500" border-radius="6px" padding="20px 0 0 0" inner-padding="12px 20px" align="left" css-class="button-primary">
            Add to calendar
          </mj-button>

        </mj-column>
      </mj-section>

      <!-- Description -->
      <mj-section padding="28px 40px 0 40px">
        <mj-column>
          <mj-text font-size="15px" color="#3f3f46" line-height="1.6" padding="0">
            Thank you for scheduling with us. Please arrive a few minutes early to ensure we can start on time. If you have any questions before your appointment, feel free to reply to this email.
          </mj-text>
        </mj-column>
      </mj-section>

      <!-- Reschedule / Cancel Buttons -->
      <mj-section padding="24px 34px 0 34px">
        <mj-column>
          <mj-button padding="6px" href="#" background-color="#ffffff" color="#09090b" font-size="14px" font-weight="500" border-radius="6px" border="1px solid #e4e4e7" inner-padding="12px 20px" width="100%">
            Reschedule
          </mj-button>
        </mj-column>
        <mj-column>
          <mj-button padding="6px" href="#" background-color="#ffffff" color="#09090b" font-size="14px" font-weight="500" border-radius="6px" border="1px solid #e4e4e7" inner-padding="12px 20px" width="100%">
            Cancel
          </mj-button>
        </mj-column>
      </mj-section>

      <!-- Change Policy -->
      <mj-section padding="16px 40px 40px 40px">
        <mj-column>
          <mj-text font-size="13px" color="#71717b" line-height="1.5" padding="0">
            Appointments within 48 hours cannot be canceled or rescheduled.
          </mj-text>
        </mj-column>
      </mj-section>

    </mj-wrapper>

    <!-- Footer -->
    <mj-section padding="24px 40px">
      <mj-column>
        <mj-text font-size="13px" color="#a1a1aa" line-height="1.5" align="center" padding="0">
          Powered by SavvyCal
        </mj-text>
      </mj-column>
    </mj-section>

  </mj-body>
</mjml>

`;

function App() {
  const [mjml, setMjml] = useState(initialMjml);

  return (
    <div className="h-screen w-screen">
      <MjmlEditor
        value={mjml}
        onChange={(mjml: string) => {
          setMjml(mjml);
          console.log(mjml);
        }}
        liquidSchema={liquidSchema}
      />
    </div>
  );
}

export default App;
