import Chat from '@expo/material-symbols/chat.xml';
import Search from '@expo/material-symbols/search.xml';
import Sell from '@expo/material-symbols/sell.xml';
import Settings from '@expo/material-symbols/settings.xml';
import { PagerView, type PagerViewRef } from '@expo/ui/community/pager-view';
import { Icon, NavigationBar, NavigationBarItem, Text } from '@expo/ui/jetpack-compose';
import {
  createStandardRouterNavigator,
  TabRouter,
  type NavigatorContentProps,
  type TabNavigationState,
} from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { type ImageSourcePropType, View } from 'react-native';

import { NativeHost } from '@/components/native-host';
import { usePalette } from '@/theme';

type TabOptions = { title?: string; icon?: ImageSourcePropType };
type TabEvents = { tabPress: { data: undefined; canPreventDefault: true } };
type TabState = TabNavigationState<Record<string, object | undefined>>;
type ExtraProps = { preload: (name: string) => void };

/**
 * Tabs as pages of a Compose pager with a Material 3 navigation bar below, so a swipe
 * moves the tabs with the finger, as in Android apps that page between their tabs.
 */
function PagerTabs({
  state,
  descriptors,
  actions,
  emitter,
  preload,
}: NavigatorContentProps<TabOptions, TabEvents, object, ExtraProps>) {
  const palette = usePalette();
  const pager = useRef<PagerViewRef>(null);
  // The page on screen. It follows the finger during a swipe, ahead of the route state.
  const [selected, setSelected] = useState(state.index);
  const shown = useRef(state.index);

  // Tabs not visited yet are placeholders (see below). Preloading turns them into real
  // routes, so every page has its screen ready before it is swiped to.
  useEffect(() => {
    for (const route of state.routes) {
      if (route.key === route.name) preload(route.name);
    }
  }, [state.routes, preload]);

  // Navigation from elsewhere (a tab press, a link) moves the pager.
  useEffect(() => {
    if (shown.current === state.index) return;
    shown.current = state.index;
    setSelected(state.index);
    pager.current?.setPage(state.index);
  }, [state.index]);

  const press = (index: number) => {
    const route = state.routes[index];
    const event = emitter.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
    if (!event.defaultPrevented && index !== state.index) actions.navigate(route.name);
  };

  return (
    <View className="flex-1 bg-surface">
      <PagerView
        ref={pager}
        style={{ flex: 1 }}
        initialPage={state.index}
        // Keeps every tab composed, so each one's stack stays alive between visits.
        offscreenPageLimit={state.routes.length - 1}
        onPageScroll={({ nativeEvent }) => {
          const nearest = Math.round(nativeEvent.position + nativeEvent.offset);
          setSelected((current) => (current === nearest ? current : nearest));
        }}
        onPageSelected={({ nativeEvent }) => {
          const index = nativeEvent.position;
          shown.current = index;
          setSelected(index);
          if (index !== state.index) actions.navigate(state.routes[index].name);
        }}
      >
        {state.routes.map((route) => (
          // Keyed by name: a placeholder and the route that replaces it are the same page.
          <View key={route.name} style={{ flex: 1 }}>
            {descriptors[route.key].render()}
          </View>
        ))}
      </PagerView>
      <NativeHost matchContents={{ vertical: true }}>
        <NavigationBar containerColor={palette['surface-container']}>
          {state.routes.map((route, index) => {
            const { title, icon } = descriptors[route.key].options;
            return (
              <NavigationBarItem
                key={route.key}
                selected={index === selected}
                onClick={() => press(index)}
                colors={{
                  selectedIndicatorColor: palette['secondary-container'],
                  selectedIconColor: palette['on-secondary-container'],
                  selectedTextColor: palette['on-surface'],
                  unselectedIconColor: palette['on-surface-variant'],
                  unselectedTextColor: palette['on-surface-variant'],
                }}
              >
                <NavigationBarItem.Icon>
                  {icon ? <Icon source={icon} contentDescription={title} /> : null}
                </NavigationBarItem.Icon>
                <NavigationBarItem.Label>
                  <Text>{title ?? route.name}</Text>
                </NavigationBarItem.Label>
              </NavigationBarItem>
            );
          })}
        </NavigationBar>
      </NativeHost>
    </View>
  );
}

/**
 * The tab router only holds tabs that have been visited, but the pager and the bar need
 * all of them. Missing tabs get a placeholder route keyed by name, as NativeTabs does.
 */
const Tabs = createStandardRouterNavigator(PagerTabs, TabRouter, {
  processDescriptors: (descriptors, state: TabState, describe) => {
    const missing = state.routeNames.filter((name) => !state.routes.some((r) => r.name === name));
    if (missing.length === 0) return descriptors;
    const added = Object.fromEntries(
      missing.map((name) => [name, describe({ key: undefined, name } as never)]),
    );
    return { ...descriptors, ...added };
  },
  processState: (state: TabState, descriptors) => {
    if (state.routeNames.every((name) => state.routes.some((r) => r.name === name))) return state;
    const focused = state.routes[state.index]?.key;
    const routes = state.routeNames.map(
      (name) =>
        state.routes.find((r) => r.name === name) ?? {
          ...descriptors[name].route,
          key: name,
          name,
        },
    );
    return {
      ...state,
      routes,
      index: Math.max(
        0,
        routes.findIndex((r) => r.key === focused),
      ),
    };
  },
  createProps: ({ dispatch }) => ({
    preload: (name: string) => dispatch({ type: 'PRELOAD', payload: { name } }),
  }),
});

export function AppTabs() {
  return (
    <Tabs>
      <Tabs.Screen name="(notes)" options={{ title: 'Notes', icon: Chat }} />
      <Tabs.Screen name="search" options={{ title: 'Search', icon: Search }} />
      <Tabs.Screen name="tags" options={{ title: 'Tags', icon: Sell }} />
      <Tabs.Screen name="settings" options={{ title: 'Settings', icon: Settings }} />
    </Tabs>
  );
}
