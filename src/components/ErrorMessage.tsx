import React from 'react';
import { StyleSheet } from 'react-native';
import { HelperText } from 'react-native-paper';

interface ErrorMessageProps {
  message: string;
  visible?: boolean;
}

export function ErrorMessage({ message, visible = true }: ErrorMessageProps) {
  return (
    <HelperText type="error" visible={visible} style={styles.error}>
      {message}
    </HelperText>
  );
}

const styles = StyleSheet.create({
  error: {
    marginBottom: 8,
  },
});