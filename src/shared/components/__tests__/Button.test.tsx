import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { BaseButton, Button } from '../Button';
import { componentRegistry } from '../ComponentRegistry';
import { Text } from 'react-native';

describe('Button', () => {
  describe('BaseButton', () => {
    it('renders the title correctly', () => {
      const { getByText } = render(<BaseButton title="Click Me" onPress={() => {}} />);
      expect(getByText('Click Me')).toBeTruthy();
    });

    it('calls onPress when pressed', () => {
      const onPressMock = jest.fn();
      const { getByText } = render(<BaseButton title="Press" onPress={onPressMock} />);
      
      fireEvent.press(getByText('Press'));
      expect(onPressMock).toHaveBeenCalledTimes(1);
    });

    it('displays an activity indicator when loading', () => {
      const { queryByText } = render(
        <BaseButton title="Loading" onPress={() => {}} loading={true} />
      );
      
      // Title should not be visible when loading
      expect(queryByText('Loading')).toBeNull();
    });

    it('is disabled when disabled prop is true', () => {
      const onPressMock = jest.fn();
      const { getByText } = render(
        <BaseButton title="Disabled" onPress={onPressMock} disabled={true} />
      );
      
      fireEvent.press(getByText('Disabled'));
      expect(onPressMock).not.toHaveBeenCalled();
    });

    it('is disabled when loading prop is true', () => {
      const onPressMock = jest.fn();
      const { getByTestId } = render(
        <BaseButton title="Loading" onPress={onPressMock} loading={true} />
      );
      
      // Touching the button should not trigger onPress
      fireEvent.press(getByTestId('base-button'));
      expect(onPressMock).not.toHaveBeenCalled();
    });
  });

  describe('Registry-aware Button', () => {
    it('resolves the default BaseButton when no override is registered', () => {
      const { getByText } = render(<Button title="Registry" onPress={() => {}} />);
      expect(getByText('Registry')).toBeTruthy();
    });

    it('uses the custom implementation when registered', () => {
      const CustomButton = ({ title }: { title: string }) => <Text>Custom {title}</Text>;
      
      // Save current mapping
      const original = componentRegistry.resolve('Button');
      
      componentRegistry.register({ Button: CustomButton as any });
      const { getByText, unmount } = render(<Button title="Test" onPress={() => {}} />);
      
      expect(getByText('Custom Test')).toBeTruthy();
      
      // Cleanup: Restore original
      componentRegistry.register({ Button: original });
      unmount();
    });
  });
});
