import { View, Text, SafeAreaView, TouchableOpacity, Image } from 'react-native'
import React,{useMemo, useState} from 'react'
import type {FC, ReactElement} from 'react';
import type {StyleProp, ViewStyle} from 'react-native';
import { Ionicons } from '@expo/vector-icons'
import MasonryList from '@react-native-seoul/masonry-list';
// 📗 khai báo thư viện mà expo hổ trỡ để lấy giá trị chiều cao  statusBar
import Constants from "expo-constants";

import { useRouter } from 'expo-router';
interface Furniture {
  id: string;
  imgURL: string;
  text: string;
}

const _collections :Furniture[] = [
  {
    id: 'id123',
    imgURL:
      'https://images.unsplash.com/photo-1547119957-637f8679db1e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bW9uaXRvcnxlbnwwfHwwfHx8MA%3D%3D',
    text: 'Du lich 2024',
  },
  {
    id: 'id124',
    imgURL:
      'https://images.unsplash.com/photo-1551645120-d70bfe84c826?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bW9uaXRvcnxlbnwwfHwwfHx8MA%3D%3D',
      text: 'Du lich 2024',
  },
  {
    id: 'id125',
    imgURL:
      'https://images.unsplash.com/photo-1591370874773-6702e8f12fd8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fG1vbml0b3J8ZW58MHx8MHx8fDA%3D',
      text: 'Du lich 2024',
  },
  {
    id: 'id126',
    imgURL:
      'https://images.unsplash.com/photo-1598986646512-9330bcc4c0dc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fG1vbml0b3J8ZW58MHx8MHx8fDA%3D',
      text: 'Du lich 2024',
  },
  {
    id: 'id127',
    imgURL:
      'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fG1vbml0b3J8ZW58MHx8MHx8fDA%3D',
    text: 'Du lich 2024',
  },
  {
    id: 'id128',
    imgURL:
      'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8aGVhZHBob25lfGVufDB8fDB8fHww',
      text: 'Du lich 2024',
  },
  {
    id: 'id129',
    imgURL:
      'https://images.unsplash.com/photo-1551739440-5dd934d3a94a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fG1vbml0b3J8ZW58MHx8MHx8fDA%3D',
      text: 'Du lich 2024',
  },
  {
    id: 'id110',
    imgURL:
      'https://images.unsplash.com/photo-1527800792452-506aacb2101f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDB8fG1vbml0b3J8ZW58MHx8MHx8fDA%3D',
      text: 'Du lich 2024',
  },
  {
    id: 'id130',
    imgURL:
      'https://images.unsplash.com/photo-1542546068979-b6affb46ea8f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzh8fG1vbml0b3J8ZW58MHx8MHx8fDA%3D',
      text: 'Du lich 2024',
  },
  {
    id: 'id131',
    imgURL:
      'https://images.unsplash.com/photo-1573285750682-05689540dfbc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDd8fG1vbml0b3J8ZW58MHx8MHx8fDA%3D',
      text: 'Du lich 2024',
  },

]
const FurnitureCard: FC<{item: Furniture; style: StyleProp<ViewStyle>}> = ({
  item,
  style,
}) => {
  const randomBool = useMemo(() => Math.random() < 0.5, []);
  
  return (
  
     <TouchableOpacity key={item.id} style={[{marginTop: 12, flex: 1}, style]}>
          <View style={{width:'100%',backgroundColor:'#fff',borderRadius:20,overflow:'hidden'}}>
          <Image
        source={{uri: item.imgURL}}
        style={{
          height: randomBool ? 150 : 280,
          alignSelf: 'stretch',
        }}
        resizeMode="cover"
      />
              <Text style={{fontWeight:600, textAlign:'center',paddingVertical:15,fontSize:14}}>  {item.text}</Text>
          </View>
      </TouchableOpacity>
  );
};

const CollectionScreen = () => {
  const router = useRouter();
  const renderItem = ({item, i} : any): ReactElement => {
    return (
      <FurnitureCard item={item} style={{marginLeft: i % 2 === 0 ? 0 : 12}} />
    );
  };

  return (
  
      <View style={{flex:1,width:'100%',height:'100%',paddingTop:Constants.statusBarHeight+10}}>
         {/* header */}
          <View style={{flexDirection:'row',justifyContent:'space-between',paddingHorizontal:20, alignItems:'center'}}>
               <TouchableOpacity onPress={() => router.back()}>
                  <Ionicons name='chevron-back' size={30} />
               </TouchableOpacity>
               <Text style={{fontSize:20}}>Collections</Text>
               <TouchableOpacity>
                  <Ionicons name='filter' size={30} />
               </TouchableOpacity>
          </View>
       
          {/* body */}
         <View style={{width:'100%',flex:1,paddingTop:10}}>
         <MasonryList
           data={_collections}
           renderItem={renderItem}
            keyExtractor={(item: any): string => item.id}
          
            contentContainerStyle={{
              paddingHorizontal: 10,
              alignSelf: 'stretch',
            }}
            onEndReached={() => console.log('onEndReached')}
             numColumns={2}
       
          />
         </View>
      </View>
  
  )
}

export default CollectionScreen