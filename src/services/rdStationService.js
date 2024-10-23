export const sendLeadData = async (leadData) => {
    try {
      const response = await fetch('https://api.rd.services/platform/conversions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer YOUR_ACCESS_TOKEN`, // Substitua pelo seu token de acesso
        },
        body: JSON.stringify({
          conversion_identifier: 'lead-form',
          name: leadData.name,
          company: leadData.company,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Erro ao enviar dados');
      }
  
      const data = await response.json();
      console.log('Lead enviado ao RD Station:', data);
    } catch (error) {
      console.error('Erro ao enviar lead:', error);
    }
  };
  