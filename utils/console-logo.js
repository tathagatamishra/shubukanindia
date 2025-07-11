export const displayConsoleLogo = () => {
  console.clear();

  const simpleLogo = `
   ███████ ██   ██ ██    ██ ██████  ██    ██ ██   ██  █████  ███    ██ 
   ██      ██   ██ ██    ██ ██   ██ ██    ██ ██  ██  ██   ██ ████   ██ 
   ███████ ███████ ██    ██ ██████  ██    ██ █████   ███████ ██ ██  ██ 
        ██ ██   ██ ██    ██ ██   ██ ██    ██ ██  ██  ██   ██ ██  ██ ██ 
   ███████ ██   ██  ██████  ██████   ██████  ██   ██ ██   ██ ██   ████ 
    
   ██ ███    ██ ██████  ██  █████  
   ██ ████   ██ ██   ██ ██ ██   ██ 
   ██ ██ ██  ██ ██   ██ ██ ███████ 
   ██ ██  ██ ██ ██   ██ ██ ██   ██ 
   ██ ██   ████ ██████  ██ ██   ██ 
  `;

  const creditLine = 'Created by Tathagata Mishra';
  const linkedinURL = 'https://linkedin.com/in/tathagatamishra/';

  console.log(
    '%c' + simpleLogo,
    'color: #FF8500; font-family: monospace; font-weight: bold; font-size: 10px;'
  );

  console.log(
    '%c' + creditLine + '\n%c' + linkedinURL,
    'color: #ED1B24; font-weight: bold; font-size: 12px;',
    'color: #FF8500; font-style: italic; font-size: 12px;'
  );
};
