import { ActionPanel, Detail, List, openCommandPreferences, getPreferenceValues, Action, showToast, Toast, popToRoot } from "@raycast/api";
import { useEffect, useState } from "react";
import { Actions } from "./Actions";
import { getQueue } from "./matterApi";

interface State {
  items?: any;
  error?: Error;
}

export default function Command() {
  const [state, setState] = useState<State>({})
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    async function fetchQueue() {
      setLoading(true)
      try {
        const items: any = await getQueue()
        if (items.code == 'token_not_valid') {
          showToast(Toast.Style.Failure, "Token not valid", "Please check your token in preferences")
          popToRoot()
          return
        }
        setState({ items })
        setLoading(false)
      } catch (error) {
        setLoading(false)
        setState({
          error: error instanceof Error ? error : new Error('Something went wrong'),
        })
      }
    }

    fetchQueue()
  }, [])


  return (
    <>
      <List isLoading={loading}>
        {state.items?.feed.map((item: any) => (
          <List.Item
            key={item.id}
            icon={item.content.photo_thumbnail_url}
            title={item.content.title}
            actions={<Actions item={item} />}
            accessories={[{
              text: item.content.article?.word_count ? item.content.article?.word_count.toString() + ' words' : ''
            }]}
          />

        ))}

      </List>


    </>


  );
}
