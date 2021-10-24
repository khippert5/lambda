// @flow

export const kmiLogger = (value: any) => {
  let type = value && value.error ? 'error' : 'info';
  if (/error/gi.test(JSON.stringify(value))) type = 'error';
  // eslint-disable-next-line no-console
  console.log({
    type,
    notice: 'KMI_LOG_STATUS',
    ...value,
  });
};

export default kmiLogger;
