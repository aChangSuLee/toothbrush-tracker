export const parseCsvFile = async (filePath: string): Promise<string[][]> => {
  try {
    const response = await fetch(filePath);
    const csvText = await response.text();
    
    // CSV 텍스트를 행으로 분할
    const rows = csvText.split('\n');
    
    // 각 행을 열로 분할하고 빈 행 제거
    return rows
      .filter(row => row.trim() !== '')
      .map(row => row.split(',').map(cell => cell.trim()));
  } catch (error) {
    console.error('CSV 파일을 읽는 중 오류 발생:', error);
    return [];
  }
};

export const csvToObjects = <T>(
  csvData: string[][],
  headers: string[],
  transformer: (row: Record<string, string>) => T
): T[] => {
  if (csvData.length < 1) return [];

  // 첫 번째 행이 헤더가 아닌 경우를 위해 제공된 헤더 사용
  const data = csvData.map(row => {
    const obj: Record<string, string> = {};
    headers.forEach((header, index) => {
      obj[header] = row[index] || '';
    });
    return transformer(obj);
  });

  return data;
}; 