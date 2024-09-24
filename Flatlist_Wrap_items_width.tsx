import { height, width } from '@constants/responsiveSize';
import React from 'react';
import { FlatList, Text, View } from 'react-native';

const data = [
    { width: width * 0.445 },
    { width: width * 0.445 },
    { width: width * 0.445 },
    { width: width * 0.445 },
    { width: width * 0.445 },
    { width: width * 0.445 },
    { width: width - 30 },
    { width: width * 0.445 },
    { width: width * 0.445 },
];

const WrapFlatlist = () => {
    const renderItem = ({ item, index }: any) => {
        return (
            <View style={{
                height: 150,
                margin: 5,
                backgroundColor: 'lightblue',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 10,
                width: item.width
            }}>
                <Text style={{
                    fontSize: 24,
                }}>{index + 1}</Text>
            </View>
        );
    };

    return (
        <View style={{
            flex: 1,
            marginTop: 50,
        }}>
            <FlatList
                // bounces={false}
                data={data}
                nestedScrollEnabled
                renderItem={renderItem}
                keyExtractor={(item: any, index: any) => String(item + index)}
                horizontal={false}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    paddingBottom: height / 3,
                    justifyContent: "space-between"
                }}
                style={{
                    marginHorizontal: 10
                }}
            />
        </View>
    );
};


export default WrapFlatlist;
