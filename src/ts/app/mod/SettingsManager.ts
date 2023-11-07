export class SettingsManager {
  public loadSettings(
    settings: ReturnType<Modding.ModContext['settings']['section']>
  ) {
    settings.add([
      {
        type: 'switch',
        name: 'global-icons',
        label: 'Enable Global Icons',
        hint: 'Show icons outside of Astrology and Agility',
        default: true,
        onChange: () => {
          const hint = document
            .getElementById(`tinyIcons:global-icons`)
            ?.nextElementSibling?.querySelector('small');

          if (hint) {
            hint.textContent = 'Reload Required';
            hint.classList.add('text-warning');
            this.updateButton();
          }
        },
      } as unknown as Modding.Settings.SwitchConfig,
      {
        type: 'switch',
        name: 'secondary-icons',
        label: 'Enable Secondary Icons',
        hint: ' ',
        default: false,
        onChange: () => {
          game.agility.renderQueue.builtObstacles = true;
          game.astrology.onConstellationExplore();

          const hint = document
            .getElementById(`tinyIcons:secondary-icons`)
            ?.nextElementSibling?.querySelector('small');

          if (hint) {
            hint.textContent = 'Reload required to take effect in global icons';
            hint.classList.add('text-warning');
            this.updateButton();
          }
        },
      } as unknown as Modding.Settings.SwitchConfig,
      {
        type: 'button',
        name: 'save-reload',
        display: 'Save & Reload',
        color: 'primary',
        onClick: () => {
          saveData();
          window.location.reload();
        },
      } as unknown as Modding.Settings.ButtonConfig,
    ]);
  }

  private updateButton() {
    const btn = document.getElementById('tinyIcons:save-reload');
    if (btn && btn.classList.contains('btn-primary'))
      btn.classList.replace('btn-primary', 'btn-danger');
  }
}
