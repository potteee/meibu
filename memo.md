author : "作者",
director : "監督",
editor : "編集者",
screenPlayer : "脚本家",
originalWriter : "原作者",
artDirector : "作画担当者",
characterDesigner : "キャラクターデザイナー",
characterDraftsCreater : "キャラクター原案作成者",
coCreator : "共同作成者",
actor : "出演者",
characterVoice : "声優",
illustrator : "イラストレイター",
producer : "企画者",



                    <List subheader={<li />} className={classes.postingWinfoCreatorList}>
                    {/* <List className={classes.root} subheader={<li />}> */}
                    {/* Array.from(new Set(array1)) */}

                    {/* もしくは、ここで重複排除しないで全て表示させた上で、kind表示の時に重複の条件をフラグなどでつける。 */}
                    {() => {
                      let firstDisplay
                      let lastDisplay
                      for(let k = 0;k < state.winfoCreator.length;k++){
                        firstDisplay = true //最初のkindなので表示
                        lastDisplay = false //最後のkindなので非表示
                        if(k != 0){
                          if(state.winfoCreator[k].kind == state.winfoCreator[k-1].kind){
                            firstDisplay = false //直前のkindと同じkindの場合非表示にする。
                          }
                          if(state.winfoCreator[k].kind != state.winfoCreator[k-1].kind){
                            lastDisplay = true //直前のkindと異なる場合のみ表示
                          }
                        }
                         //最終配列もしくは一つあとが別のkindの場合　逆に頭に持ってきて、一番最後のやつはforの外に出す
                        lastDisplay 
                        ? (`
                            </ul>
                              </li>
                          `)
                        : null

                        firstDisplay //kind 開始部
                          ? (<li key={`kind-${state.winfoCreator[k].kind}`}>
                              <ul>
                                <ListSubheader>{`${state.winfoCreator[k].kind}`}</ListSubheader>
                          )
                          : null
                          {/* //CreatorList部 */}
                          <ListItem key={`${state.winfoCreator[k].kind}-${state.winfoCreator[k].creatorName}`}>
                            <ListItemText primary={`Item ${state.winfoCreator[k].creatorName}`} />
                          </ListItem>
                          </ul>

                      )

                      
                      return (
                        <>

                        </>
                      )
                      }}
       
                      {Array.from(new Set(state.winfoCreator)).map((map) => (
                        // {[0, 1, 2, 3, 4].map((sectionId) => (
                        <li key={`kind-${map.kind}`}>
                        {/* <li key={`section-${sectionId}`} className={classes.listSection}> */}
                          <ul>
                          {/* <ul className={classes.ul}> */}
                          <ListSubheader>{`${map.kind}`}</ListSubheader>

ここでkindに現在のkindと一致するインスタンスを絞り込む
[kind:xxxxxx,Name:yyyyy,
kind:xxxxxx,Name:yyyyy,
kind:xxxxxx,Name:yyyyy,]

                            {state.winfoCreator.map((item) => (
                              <ListItem key={`item-${sectionId}-${item}`}>
                                <ListItemText primary={`Item ${item}`} />
                              </ListItem>
                            ))}
                          </ul>
                        </li>
                      ))}
                    </List>